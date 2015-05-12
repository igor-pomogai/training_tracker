var redrawTrainingWeek = function(newsToShow, weekDay) {
	var gymLabel = '<span class="label label-success">gym</span>';
	var poolLabel = '<span class="label label-info">pool</span>';
	var runningLabel = '<span class="label label-warning">run</span>';

	var rightDay;

	$('#' + weekDay + 'Run').empty();
	$('#' + weekDay + 'Pool').empty();
	$('#' + weekDay + 'Gym').empty();

	newsToShow.forEach(function(news) {
		switch (news) {
			case 'run_visit':
				rightDay = $('#' + weekDay + 'Run');

				if (!rightDay.has("span").length) {
					rightDay.append(runningLabel);
				}

				break;
			case 'pool_visit':
				rightDay = $('#' + weekDay + 'Pool');

				if (!rightDay.has("span").length) {
					rightDay.append(poolLabel);
				}

				break;
			case 'gym_visit':
				rightDay = $('#' + weekDay + 'Gym');

				if (!rightDay.has("span").length) {
					rightDay.append(gymLabel);
				}
				
				break; 
		}
	});
};